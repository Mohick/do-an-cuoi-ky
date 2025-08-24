'use client'
import { FileTextFilled } from "@ant-design/icons"
import { AnimatePresence, motion } from "framer-motion"
import React from "react"

interface PropsInputAuth extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'label' | "error"> {
    label: {
        text: string,
        className?: string
    }
    error?: string | undefined | any
    type: string,
    className?: string,
    Icon?: React.ComponentType;
}


export default function InputAuth({ type, className, Icon = FileTextFilled, label, ...props }: PropsInputAuth) {
    return <div className={`${className}`}>
        <label htmlFor={props.id} className={`${label.className} flex  items-center text-nowrap`}>
            <p className="flex-1 mb-2">
                {label.text}
            </p>
            <AnimatePresence >
                {props.error && (
                    <motion.p
                        initial={{ opacity: 0, width: 0, }}
                        animate={{ opacity: 1, width: '100%' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.25 }}
                        className=" text-sm font-medium  inline-block text-red-500 origin-left text-nowrap overflow-hidden  rounded-md  transform text-end "
                    >
                        {props.error}
                    </motion.p>
                )}
            </AnimatePresence>
        </label>
        <div className={` flex items-center gap-2 border border-current px-2  rounded-md`} >
            <Icon />
            <input {...props} type={`${type}`} className={`w-full placeholder:text-gray-400 h-full px-2 outline-none py-2`} />
        </div>

    </div>
} 