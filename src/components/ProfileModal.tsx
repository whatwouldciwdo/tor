"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name: string;
    username: string;
    email: string;
    position: string;
    bidang: string;
  };
  onUpdate: (data: { email?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
}

export default function ProfileModal({ isOpen, onClose, userData, onUpdate }: ProfileModalProps) {
  const [email, setEmail] = useState(userData.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setError("");
    setSuccess("");

    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }

    // If changing password, validate password fields
    if (isChangingPassword) {
      if (!currentPassword) {
        setError("Current password is required");
        return;
      }
      if (!newPassword) {
        setError("New password is required");
        return;
      }
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Show confirmation dialog
      setShowConfirmDialog(true);
      return;
    }

    // If only updating email
    await performUpdate();
  };

  const performUpdate = async () => {
    setIsSaving(true);
    try {
      const updateData: any = { email };
      
      if (isChangingPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      await onUpdate(updateData);
      
      setSuccess("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      setShowConfirmDialog(false);
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      setShowConfirmDialog(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
        <div className="bg-[#1f1f1f] rounded-lg shadow-xl w-full max-w-md mx-4 border border-[#42ff6b]/30">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded">
                {success}
              </div>
            )}

            {/* Read-only Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={userData.name}
                disabled
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-not-allowed opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <input
                type="text"
                value={userData.username}
                disabled
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-not-allowed opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Position
              </label>
              <input
                type="text"
                value={userData.position}
                disabled
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-not-allowed opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Bidang
              </label>
              <input
                type="text"
                value={userData.bidang}
                disabled
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-not-allowed opacity-60"
              />
            </div>

            {/* Editable Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#42ff6b]/30 rounded-lg text-white focus:border-[#42ff6b] focus:ring-1 focus:ring-[#42ff6b] outline-none placeholder:text-gray-500"
                style={{ color: 'white' }}
              />
            </div>

            {/* Password Change Section */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-400">
                  Change Password
                </label>
                <button
                  onClick={() => {
                    setIsChangingPassword(!isChangingPassword);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="text-sm text-[#42ff6b] hover:underline"
                >
                  {isChangingPassword ? "Cancel" : "Change"}
                </button>
              </div>

              {isChangingPassword && (
                <div className="space-y-3">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#42ff6b]/30 rounded-lg text-white focus:border-[#42ff6b] focus:ring-1 focus:ring-[#42ff6b] outline-none pr-10 placeholder:text-gray-500"
                        style={{ color: 'white' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#42ff6b]/30 rounded-lg text-white focus:border-[#42ff6b] focus:ring-1 focus:ring-[#42ff6b] outline-none pr-10 placeholder:text-gray-500"
                        style={{ color: 'white' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#42ff6b]/30 rounded-lg text-white focus:border-[#42ff6b] focus:ring-1 focus:ring-[#42ff6b] outline-none pr-10 placeholder:text-gray-500"
                        style={{ color: 'white' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-[#42ff6b] text-black rounded-lg hover:bg-[#38e05c] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Password Change */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110]">
          <div className="bg-[#1f1f1f] rounded-lg shadow-xl w-full max-w-sm mx-4 border border-[#42ff6b]/30">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Confirm Password Change</h3>
              <p className="text-gray-300 text-sm mb-6">
                Are you sure you want to change your password? You will need to use the new password on your next login.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={performUpdate}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#42ff6b] text-black rounded-lg hover:bg-[#38e05c] transition disabled:opacity-50 font-medium"
                >
                  {isSaving ? "Changing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
