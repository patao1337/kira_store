import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AccountForm() {
  const { state, updateProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.user) {
      setFullName(state.user.full_name || '');
      setUsername(state.user.username || '');
      setPhone(state.user.phone || '');
      setAddress(state.user.address || '');
      setAvatarUrl(state.user.avatar_url || '');
      setPreviewUrl(''); // Clear preview when user data loads
      setAvatarFile(null); // Clear selected file when user data loads
    }
  }, [state.user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile || !state.user) return;

    setUploadingAvatar(true);

    try {
      // Delete old avatar if exists
      if (avatarUrl && avatarUrl.includes('supabase.co')) {
        const oldPath = avatarUrl.split('/storage/v1/object/public/profiles/')[1];
        if (oldPath) {
          await supabase.storage.from('profiles').remove([oldPath]);
        }
      }
      
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${state.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Не вдалося завантажити зображення');
      }

      // Get public URL
      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      const newAvatarUrl = data.publicUrl;
      
      // Update profile with new avatar
      const { error } = await updateProfile({
        avatar_url: newAvatarUrl,
      });

      if (error) {
        throw new Error(error.message || 'Не вдалося оновити аватар');
      }

      // Update local state
      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      setPreviewUrl('');

    } catch (error) {
      console.error('Error updating avatar:', error);
      alert(error instanceof Error ? error.message : 'Сталася помилка');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setPreviewUrl('');
    // Reset file input
    const fileInput = document.getElementById('avatar-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!state.user) return;

    setRemovingAvatar(true);

    try {
      // Delete avatar file from storage if exists
      if (avatarUrl && avatarUrl.includes('supabase.co')) {
        const oldPath = avatarUrl.split('/storage/v1/object/public/profiles/')[1];
        if (oldPath) {
          await supabase.storage.from('profiles').remove([oldPath]);
        }
      }

      // Update profile to remove avatar URL
      const { error } = await updateProfile({
        avatar_url: '',
      });

      if (error) {
        throw new Error(error.message || 'Не вдалося видалити аватар');
      }

      // Update local state
      setAvatarUrl('');
      setAvatarFile(null);
      setPreviewUrl('');

    } catch (error) {
      console.error('Error removing avatar:', error);
      alert(error instanceof Error ? error.message : 'Сталася помилка');
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Update profile (excluding avatar which is handled separately)
      const { error } = await updateProfile({
        full_name: fullName,
        username,
        phone,
        address,
      });

      if (error) {
        throw new Error(error.message || 'Не вдалося оновити профіль');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Сталася помилка');
    } finally {
      setIsUpdating(false);
    }
  };

  if (state.loading) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  if (!state.user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Налаштування облікового запису</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 group">
              {(previewUrl || avatarUrl) ? (
                <>
                  <img 
                    src={previewUrl || avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  {/* Hover overlay for removing avatar - only show if not in preview mode */}
                  {avatarUrl && !previewUrl && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={removingAvatar || uploadingAvatar}
                        className="text-white text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingAvatar ? 'Видалення...' : 'Видалити'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-center text-sm px-2">
                  Немає зображення
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-sm">Завантаження...</div>
                </div>
              )}
              {removingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-sm">Видалення...</div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <label className="cursor-pointer">
                <span className="text-sm text-primary hover:underline">
                  {uploadingAvatar ? 'Завантаження...' : 'Змінити аватар'}
                </span>
                <input 
                  id="avatar-input"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar || removingAvatar}
                />
              </label>
            </div>

            {/* Avatar save prompt - shows when new file is selected */}
            {avatarFile && previewUrl && (
              <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-blue-800 mb-3 text-center">
                  Зберегти новий аватар?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveAvatar}
                    disabled={uploadingAvatar}
                    className="flex-1 text-xs"
                  >
                    {uploadingAvatar ? 'Збереження...' : 'Зберегти'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelAvatar}
                    disabled={uploadingAvatar}
                    className="flex-1 text-xs"
                  >
                    Скасувати
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-8 w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                Вийти
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Електронна пошта
              </label>
              <input
                id="email"
                type="email"
                value={state.user.email}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                Електронну пошту не можна змінити
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Повне ім'я
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Ім'я користувача
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Номер телефону
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Адреса
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isUpdating}
            >
              {isUpdating ? 'Збереження...' : 'Зберегти зміни профілю'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 