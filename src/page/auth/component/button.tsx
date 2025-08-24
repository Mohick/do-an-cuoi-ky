



interface PropsButtonAuth extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    className?: string
}

export default function ButtonAuth({ className,text,...props }: PropsButtonAuth) {
    return (
        <button {...props} className={`${className} bg-white hover:opacity-80 text-black w-full py-2  rounded-md`}>
            {text}
        </button>
    )
}