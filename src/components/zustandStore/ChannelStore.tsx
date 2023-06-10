import create from 'zustand';

enum EnumType {
    public= 'PUBLIC',
    private= 'PRIVATE'
}

type User = {
    name: string;
    type: EnumType;
    members: string;
    setName: (name: string) => void;
    setType: (type: EnumType) => void;
    setMembers: (members: string) => void;
};

const useUserChannel = create<User>((set) => ({
    name:'',
    type: EnumType.public,
    members: '',
    setName: (name)=> set({ name }),
    setType: (type) => set({ type }),
    setMembers: (members) => set({ members }),
}));

export default useUserChannel;