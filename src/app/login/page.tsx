'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState(false)

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const res = await signIn('credentials', {
            username: form.get('username'),
            password: form.get('password'),
            redirect: false,
        })

        if (res?.ok) router.push('/')
        else setError(true)
    }

    return (
        <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-32 flex flex-col gap-4">
            <input name="username" placeholder="Username" className="border px-3 py-2" />
            <input name="password" type="password" placeholder="Password" className="border px-3 py-2" />
            <button className="bg-black text-white px-4 py-2">Login</button>
            {error && <p className="text-red-500 text-sm">Неверный логин или пароль</p>}
        </form>
    )
}
