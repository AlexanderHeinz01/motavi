export interface UserPublic {
  email: string
  name?: string
  company?: string
  role: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: UserPublic
}

const DEFAULT_USERS: Record<string, UserPublic> = {
  'demo@motavi.de': {
    email: 'demo@motavi.de',
    name: 'Alexander Heinz',
    company: 'Motavi Demo GmbH',
    role: 'admin',
  },
}

export async function loginRequest(email: string, password: string): Promise<TokenResponse> {
  // Allow demo user or any valid email
  if (!email || !password) {
    throw new Error('Bitte E-Mail-Adresse und Passwort eingeben.')
  }

  // Artificial short delay for realistic feedback
  await new Promise((r) => setTimeout(r, 400))

  const user: UserPublic = DEFAULT_USERS[email.toLowerCase()] || {
    email: email.toLowerCase(),
    name: email.split('@')[0],
    company: 'Produktionswerk',
    role: 'user',
  }

  const token = 'motavi_jwt_' + btoa(email) + '_' + Date.now()
  return {
    access_token: token,
    token_type: 'bearer',
    user,
  }
}

export async function fetchMe(token: string): Promise<UserPublic> {
  if (!token || !token.startsWith('motavi_jwt_')) {
    throw new Error('Ungültiges Token.')
  }
  const parts = token.split('_')
  const email = atob(parts[2] || '') || 'demo@motavi.de'
  return (
    DEFAULT_USERS[email.toLowerCase()] || {
      email,
      name: email.split('@')[0],
      company: 'Produktionswerk',
      role: 'user',
    }
  )
}
