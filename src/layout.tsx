




export default function LayoutApp({ children , className = ''}: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`w-full max-w-[90%] min-w-[90%] m-auto ${className}`}>
            {children}
        </div>
    )
}