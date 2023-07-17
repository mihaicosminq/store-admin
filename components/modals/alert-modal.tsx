"use client"

import {useEffect, useState} from "react";
import {Modal} from "@/components/ui/Modal";
import {Button} from "@/components/ui/button";

interface AlertModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    loading: boolean,
}

export const AlertModal: React.FC<AlertModalProps> = ({isOpen, onClose, onConfirm, loading}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <Modal title="are you sure" description="this action cannot be undone" onClose={onClose} isOpen={isOpen}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>Cancel</Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>
            </div>

        </Modal>
    )


}