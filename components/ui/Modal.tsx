"use client";

import React from "react";
import {DialogHeader, Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {DialogDescription} from "@radix-ui/react-dialog";

interface ModalProps {
    title: string,
    description: string,
    isOpen: boolean,
    onClose: () => void,
    children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({title, description, isOpen, onClose, children}) => {

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <Dialog  open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    )
}