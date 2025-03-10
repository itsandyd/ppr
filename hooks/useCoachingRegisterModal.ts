import { create } from 'zustand'

interface CoachingRegisterModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useCoachingRegisterModal = create<CoachingRegisterModalStore>((set) => ({
    isOpen: false,
    onOpen: () => {
        console.log('Opening coaching register modal');
        set({ isOpen: true });
    },
    onClose: () => {
        console.log('Closing coaching register modal');
        set({ isOpen: false });
    },
}));

export default useCoachingRegisterModal;