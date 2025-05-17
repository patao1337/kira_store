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
  const router = useRouter();

  useEffect(() => {
    if (state.user) {
      setFullName(state.user.full_name || '');
      setUsername(state.user.username || '');
      setPhone(state.user.phone || '');
      setAddress(state.user.address || '');
      setAvatarUrl(state.user.avatar_url || '');
    }
  }, [state.user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
      
      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
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
      let newAvatarUrl = avatarUrl;

      // Upload new avatar if selected
      if (avatarFile && state.user) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${state.user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, avatarFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
        newAvatarUrl = data.publicUrl;
      }

      // Update profile
      await updateProfile({
        full_name: fullName,
        username,
        phone,
        address,
        avatar_url: newAvatarUrl,
      });

    } catch (error) {
      console.error('Error updating profile:', error);
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
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  Немає зображення
                </div>
              )}
            </div>
            
            <label className="cursor-pointer">
              <span className="text-sm text-primary hover:underline">
                Змінити аватар
              </span>
              <input 
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          
          <div className="mt-8">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              Вийти
            </Button>
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
              {isUpdating ? 'Збереження...' : 'Зберегти зміни'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 