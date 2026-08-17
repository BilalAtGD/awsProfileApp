import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';
import { profileService } from '../services/profile.service';
import { s3Service } from '../services/s3.service';

/**
 * Custom Hook: useProfile
 * Encapsulates profile data retrieval, S3 image uploads, profile updates, and avatar URL handling.
 * Components consume this hook for declarative data access and mutation without direct API calls.
 */
export const useProfile = () => {
  const profile = useProfileStore((state) => state.profile);
  const avatarUrl = useProfileStore((state) => state.avatarUrl);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);
  
  const setProfile = useProfileStore((state) => state.setProfile);
  const setAvatarUrl = useProfileStore((state) => state.setAvatarUrl);
  const setLoading = useProfileStore((state) => state.setLoading);
  const setError = useProfileStore((state) => state.setError);
  const clearProfile = useProfileStore((state) => state.clearProfile);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.getProfile();
      const data = res.data.data;
      setProfile(data);

      if (data.profilePicKey) {
        try {
          const url = await s3Service.getViewUrl(data.profilePicKey);
          setAvatarUrl(url);
        } catch (e) {
          console.error('Failed to load avatar presigned URL:', e);
        }
      }
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to connect and load your profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setProfile, setAvatarUrl, setLoading, setError]);

  const updateProfile = useCallback(async (formData, pendingFile) => {
    setSaving(true);
    try {
      let profilePicKey = profile?.profilePicKey;

      if (pendingFile) {
        setUploading(true);
        try {
          const { uploadUrl, key } = await s3Service.getUploadUrl(pendingFile.type);
          await s3Service.uploadToS3(uploadUrl, pendingFile);
          profilePicKey = key;
        } finally {
          setUploading(false);
        }
      }

      const trimmedPhone  = formData.phone?.trim() ? formData.phone.trim() : null;
      const trimmedGender = formData.gender ? formData.gender : null;
      const parsedAge     = formData.age?.trim() ? parseInt(formData.age.trim(), 10) : null;

      const result = await profileService.updateProfile({
        name: formData.name.trim(),
        phone: trimmedPhone,
        gender: trimmedGender,
        age: parsedAge,
        profilePicKey,
      });

      const updatedProfile = result.data.data;
      setProfile(updatedProfile);

      if (profilePicKey) {
        try {
          const newAvatarUrl = await s3Service.getViewUrl(profilePicKey);
          setAvatarUrl(newAvatarUrl);
        } catch (e) {
          console.error('Failed to refresh avatar URL:', e);
        }
      }

      return updatedProfile;
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  }, [profile, setProfile, setAvatarUrl]);

  return {
    profile,
    avatarUrl,
    loading,
    error,
    saving,
    uploading,
    fetchProfile,
    updateProfile,
    clearProfile,
  };
};
