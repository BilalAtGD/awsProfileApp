import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AlertMessage from '../molecules/AlertMessage';
import ImageUploader from '../molecules/ImageUploader';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import { useProfile } from '../hooks/useProfile';
import { GENDER_OPTIONS, getDetailCardsConfig } from '../constants/profile.constants.jsx';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full Name is required')
    .min(2, 'Full Name must be at least 2 characters')
    .max(100, 'Full Name cannot exceed 100 characters'),
  phone: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val || val.trim() === '') return true;
        return /^[+\d\s\-()]{7,20}$/.test(val.trim());
      },
      { message: 'Please enter a valid phone number (e.g. +1 234 567 8900)' }
    ),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  age: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val || val.trim() === '') return true;
        const num = Number(val.trim());
        return Number.isInteger(num) && num >= 1 && num <= 120;
      },
      { message: 'Age must be a valid whole number between 1 and 120' }
    ),
});

/**
 * SUB-COMPONENT: ProfileDetailsView
 * Renders the 2x2 View Mode details grid (SRP)
 */
const ProfileDetailsView = ({ profile }) => {
  const detailCards = getDetailCardsConfig(profile);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-white/10">
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Personal Details</h3>
        <p className="text-sm text-slate-400 mt-1">
          Your registered profile details and contact preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detailCards.map((card) => (
          <div
            key={card.label}
            className="bg-white/[0.03] border border-white/10 hover:border-violet-500/35 hover:bg-white/[0.05] rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
              </div>

              <span className={`text-[10px] font-semibold px-3 py-1 rounded-full border tracking-wider uppercase shrink-0 ${card.badgeStyle}`}>
                {card.badge}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{card.label}</p>
              <p className={`text-base font-semibold truncate ${card.value === '—' ? 'text-slate-500 font-normal' : 'text-slate-100'}`}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ORGANISM: ProfileForm
 * Manages profile state transitions, S3 image uploads, and form validation via useProfile hook.
 */
const ProfileForm = ({ isEditing, onSaveSuccess, onCancelEdit }) => {
  const { profile, updateProfile, saving, uploading } = useProfile();
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [pendingFile, setPendingFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name:   profile?.name   || '',
      phone:  profile?.phone  || '',
      gender: profile?.gender || '',
      age:    profile?.age    ? String(profile.age) : '',
    },
  });

  useEffect(() => {
    setAlert({ type: '', message: '' });
    setPendingFile(null);
    reset({
      name:   profile?.name   || '',
      phone:  profile?.phone  || '',
      gender: profile?.gender || '',
      age:    profile?.age    ? String(profile.age) : '',
    });
  }, [profile, isEditing, reset]);

  const onSubmit = async (formData) => {
    setAlert({ type: '', message: '' });
    try {
      const updatedProfile = await updateProfile(formData, pendingFile);
      setPendingFile(null);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
      onSaveSuccess?.(updatedProfile);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        'Update failed. Please check your inputs.';
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  if (!isEditing) {
    return <ProfileDetailsView profile={profile} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Edit Profile Information</h3>
        <p className="text-sm text-slate-400 mt-1.5">Update your personal information and profile picture below</p>
      </div>

      {alert.message && (
        <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Avatar Section */}
      <div className="space-y-4">
        <div className="pb-3 border-b border-white/10 flex items-center gap-2.5 mb-5">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h4 className="text-xs font-bold uppercase tracking-widest text-violet-300">Profile Avatar Image</h4>
        </div>

        <ImageUploader onFileSelected={setPendingFile} uploading={uploading} />
        {pendingFile && (
          <p className="text-xs text-emerald-400 flex items-center gap-2 font-medium pt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            New photo selected — will upload when you save changes
          </p>
        )}
      </div>

      {/* Fields Section */}
      <div className="space-y-6 pt-4">
        <div className="pb-3 border-b border-white/10 flex items-center gap-2.5 mb-6">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h4 className="text-xs font-bold uppercase tracking-widest text-violet-300">Personal Details</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <FormField
            id="profile-name"
            label="Full Name"
            required
            placeholder="e.g. Muhammad Bilal"
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Email Address (Read-Only) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 opacity-60 cursor-not-allowed">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-medium text-slate-300 truncate">{profile?.email}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Email address is locked to your account</p>
          </div>

          {/* Phone Number */}
          <FormField
            id="profile-phone"
            label="Phone Number"
            placeholder="+1 234 567 8900"
            helperText="Include country code if applicable"
            error={errors.phone?.message}
            {...register('phone')}
          />

          {/* Gender Select Dropdown */}
          <div className="space-y-2">
            <label htmlFor="profile-gender" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Gender
            </label>
            <select
              id="profile-gender"
              className="w-full bg-[#0d1428] border border-white/10 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none focus:border-violet-500/80 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
              {...register('gender')}
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0d1428]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Age (Years) */}
          <div className="md:col-span-2 md:w-1/2">
            <FormField
              id="profile-age"
              label="Age (Years)"
              type="number"
              placeholder="25"
              min="1"
              max="120"
              error={errors.age?.message}
              {...register('age')}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 mt-8 border-t border-white/10">
        {onCancelEdit && (
          <Button variant="ghost" size="md" onClick={onCancelEdit} type="button">
            Cancel Changes
          </Button>
        )}
        <Button
          id="save-profile-btn"
          type="submit"
          variant="primary"
          size="md"
          loading={saving || uploading}
          disabled={!isDirty && !pendingFile}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Profile Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
