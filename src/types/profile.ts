export interface Profile {
    id: string
    email: string
    os: 'apple' | 'android'
    status: string
    proxy?: string
    tag?: string
    note?: string
}
