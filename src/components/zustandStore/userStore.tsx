import create from 'zustand';

type User = {
    name: string;
    email: string;
    password: string;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
};

const useUser = create<User>((set) => ({
    name: '',
    email: '',
    password: '',
    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
}));

export default useUser;