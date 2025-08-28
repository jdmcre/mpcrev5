import { supabase, Client, Market, Property, User } from './supabase'

export class DataService {
  // Fetch all clients
  static async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching clients:', error)
      return []
    }
    
    return data || []
  }

  // Fetch single client by ID
  static async getClient(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching client:', error)
      return null
    }
    
    return data
  }

  // Update client
  static async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating client:', error)
      return null
    }
    
    return data
  }

  // Fetch all markets
  static async getMarkets(): Promise<Market[]> {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching markets:', error)
      return []
    }
    
    return data || []
  }

  // Fetch single market by ID
  static async getMarket(id: string): Promise<Market | null> {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching market:', error)
      return null
    }
    
    return data
  }

  // Update market
  static async updateMarket(id: string, updates: Partial<Market>): Promise<Market | null> {
    const { data, error } = await supabase
      .from('markets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating market:', error)
      return null
    }
    
    return data
  }

  // Fetch all properties
  static async getProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching properties:', error)
      return []
    }
    
    return data || []
  }

  // Fetch properties by market
  static async getPropertiesByMarket(marketId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('market_id', marketId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching properties by market:', error)
      return []
    }
    
    return data || []
  }

  // Fetch single property by ID
  static async getProperty(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching property:', error)
      return null
    }
    
    return data
  }

  // Update property
  static async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating property:', error)
      return null
    }
    
    return data
  }

  // Fetch all users
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('full_name')
    
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    
    return data || []
  }

  // Fetch single user by ID
  static async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return data
  }

  // Update user
  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      return null
    }
    
    return data
  }

  // Fetch dashboard stats
  static async getDashboardStats() {
    const [clients, markets, properties, users] = await Promise.all([
      this.getClients(),
      this.getMarkets(),
      this.getProperties(),
      this.getUsers()
    ])

    return {
      totalClients: clients.length,
      totalMarkets: markets.length,
      totalProperties: properties.length,
      totalUsers: users.length,
      recentProperties: properties.slice(0, 5)
    }
  }
}
