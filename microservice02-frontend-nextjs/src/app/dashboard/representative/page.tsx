'use client'

import { useState } from 'react'
import { Button } from '@/app/ui/common/Button'

type UserType = 'Instructor' | 'Student' | 'Representative'

export default function UserManagementPage() {
  const [type, setType] = useState<UserType>('Student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [externalId, setExternalId] = useState('')
  const [message, setMessage] = useState('')

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return setMessage('❌ No token found.')

        const headers = {
          'Content-Type': 'application/json',
          'x-observatory-auth': token,
        }

        let body
        let url

        if (type === 'Student') {
          if (!externalId) return setMessage('⚠️ Student ID is required.')
            url = 'http://localhost:3004/api/register'
            body = { role: type, username, password, id: externalId }
        } else {
          url = 'http://localhost:3004/api/register/random'
          body = { role: type, username, password }
        }

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        })

        const data = await res.json().catch(() => {
          console.error('❌ Invalid JSON')
          return setMessage('❌ Server error: invalid response.')
        })

        if (!res.ok) return setMessage(`❌ Failed: ${data.error || 'Unknown error'}`)

          setMessage(`✅ ${type} "${username}" added.`)
          setUsername('')
          setPassword('')
          setExternalId('')
    } catch (err) {
      console.error('❌ Error adding user:', err)
      setMessage('❌ Error adding user.')
    }
  }

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return setMessage('❌ No token found.')

        const body: {
          role: UserType
          username: string
          password: string
          id?: string
        } = { role: type, username, password }

        if (type === 'Student' && externalId) {
          body.id = externalId
        }

        const res = await fetch('http://localhost:3004/api/register/update-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-observatory-auth': token,
          },
          body: JSON.stringify(body),
        })

        const data = await res.json()
        if (!res.ok) {
          setMessage(`❌ Failed: ${data.error || 'Unknown error'}`)
        } else {
          setMessage(`🔒 Password changed for "${username}"`)
          setUsername('')
          setPassword('')
          setExternalId('')
        }
    } catch (err) {
      console.error(err)
      setMessage('❌ Error updating password.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
    <header className="text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-1">👥 User Management</h1>
    <p className="text-gray-500">
    Manage Student, Instructor, and Representative accounts.
    </p>
    </header>

    <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* User type */}
    <label className="flex flex-col">
    <span className="text-sm font-semibold text-gray-700">Account Type</span>
    <select
    value={type}
    onChange={(e) => setType(e.target.value as UserType)}
    className="mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
    <option value="Representative">Institution Representative</option>
    <option value="Instructor">Instructor</option>
    <option value="Student">Student</option>
    </select>
    </label>

    {/* Username */}
    <label className="flex flex-col">
    <span className="text-sm font-semibold text-gray-700">Username</span>
    <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="e.g. johndoe"
    />
    </label>

    {/* Password */}
    <label className="flex flex-col">
    <span className="text-sm font-semibold text-gray-700">Password</span>
    <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="••••••••"
    />
    </label>

    {/* External ID (only for Students) */}
    {type === 'Student' && (
      <label className="flex flex-col">
      <span className="text-sm font-semibold text-gray-700">Student Registry ID</span>
      <input
      type="text"
      value={externalId}
      onChange={(e) => setExternalId(e.target.value)}
      className="mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="e.g. 03123456"
      />
      </label>
    )}
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-4 justify-end pt-2">
    <Button onClick={handleAddUser} className="px-6">
    ➕ Add User
    </Button>
    <Button variant="outline" onClick={handleChangePassword} className="px-6">
    🔄 Change Password
    </Button>
    </div>
    </section>

    {/* Message */}
    <div
    className={`transition-all duration-300 p-4 rounded-lg text-sm border ${
      message.startsWith('✅')
      ? 'bg-green-100 text-green-700 border-green-200'
  : message.startsWith('🔒')
  ? 'bg-blue-100 text-blue-700 border-blue-200'
  : message
  ? 'bg-red-100 text-red-700 border-red-200'
  : 'bg-gray-100 text-gray-600 border-gray-200'
    }`}
    >
    {message || 'Messages will appear here...'}
    </div>
    </div>
  )
}
