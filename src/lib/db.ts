import { createClient } from '@supabase/supabase-js';
import { MongoClient, Db } from 'mongodb';
import Parser from 'rss-parser';

// Ensure TypeScript types for our Article
export interface Article {
  id?: string;
  _id?: string; // For MongoDB
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  publishedAt: string;
  likes: number;
  followers: number;
  shares: number;
  source: string;
  category: string;
}

export interface SocialStat {
  id: string; // e.g. 'youtube_vlogs', 'instagram_personal'
  name: string;
  avatar: string;
  followers: string;
  rawCount: number;
  updatedAt?: string;
}

export interface SocialPost {
  id?: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl: string;
  type: 'Vlog' | 'Video' | 'Photo' | 'Reel' | 'Artwork';
  createdAt?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  demoUrl: string;
  featured: boolean;
  details?: {
    tagline: string;
    overview: string;
    features: { title: string; desc: string; }[];
    techStack: {
      frontend?: string[];
      styling?: string[];
      backend?: string[];
      apis?: string[];
      deployment?: string[];
    };
    achievements: string[];
  };
  createdAt?: string;
}

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'supabase';

// -------------------------------------------------------------------------
// 1. SUPABASE INTEGRATION
// -------------------------------------------------------------------------
let supabaseClient: any = null;

if (DATABASE_TYPE === 'supabase') {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("⚠️ Database configured as Supabase, but SUPABASE_URL or keys are missing in .env!");
  }
}

// -------------------------------------------------------------------------
// 2. MONGODB INTEGRATION
// -------------------------------------------------------------------------
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

if (DATABASE_TYPE === 'mongodb') {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'shouvik_portfolio';
  
  if (mongoUri) {
    mongoClient = new MongoClient(mongoUri);
    mongoClient.connect().then(client => {
      mongoDb = client.db(dbName);
      console.log("🔌 Successfully connected to MongoDB Atlas!");
    }).catch(err => {
      console.warn("⚠️ Failed to connect to MongoDB Atlas:", err);
    });
  } else {
    console.warn("⚠️ Database configured as MongoDB, but MONGODB_URI is missing in .env!");
  }
}

// -------------------------------------------------------------------------
// 3. ABSTRACTED DATABASE API - FORCED PRODUCTION REAL CRUD OPERATIONS
// -------------------------------------------------------------------------

/**
 * Fetches all articles from the configured database.
 * Completely deactivates the mock fallback data layers as requested.
 */
export async function getArticles(): Promise<Article[]> {
  // SUPABASE ACTIVE CRUD
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });
      
    if (error) {
      console.error("❌ Real Supabase getArticles Error:", error);
      throw error;
    }
    
    // Disable mock fallback entirely! Return empty array [] when database is empty
    if (!data || data.length === 0) {
      console.warn("⚠️ Supabase database is connected but completely empty! Returns empty articles array.");
      return [];
    }
    
    return data.map((art: any) => ({
      id: art.id,
      title: art.title,
      slug: art.slug,
      description: art.description,
      content: art.content,
      image: art.image,
      publishedAt: art.published_at || art.publishedAt,
      likes: art.likes || 0,
      followers: art.followers || 0,
      shares: art.shares || 0,
      source: art.source || 'Tech News',
      category: art.category || 'Tech',
    }));
  }
  
  // MONGODB ACTIVE CRUD
  if (DATABASE_TYPE === 'mongodb' && mongoClient) {
    const db = mongoDb || mongoClient.db(process.env.MONGODB_DB_NAME || 'shouvik_portfolio');
    const collection = db.collection<Article>('articles');
    const data = await collection.find({}).sort({ publishedAt: -1 }).toArray();
    
    // Disable mock fallback entirely! Return empty array [] when database is empty
    if (!data || data.length === 0) {
      console.warn("⚠️ MongoDB is connected but completely empty! Returns empty articles array.");
      return [];
    }

    return data.map((art: any) => ({
      id: art._id.toString(),
      title: art.title,
      slug: art.slug,
      description: art.description,
      content: art.content,
      image: art.image,
      publishedAt: art.publishedAt,
      likes: art.likes || 0,
      followers: art.followers || 0,
      shares: art.shares || 0,
      source: art.source || 'Tech News',
      category: art.category || 'Tech',
    }));
  }

  // If no DB is configured, return empty
  return [];
}

/**
 * Fetches a single article by its unique URL slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // SUPABASE ACTIVE CRUD
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle(); // Prevents throwing when 0 rows match
      
    if (error) {
      console.error(`❌ Real Supabase getArticleBySlug Error [Slug: ${slug}]:`, error);
      throw error;
    }
    
    if (!data) return null; // Disable mock fallback!
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      image: data.image,
      publishedAt: data.published_at || data.publishedAt,
      likes: data.likes || 0,
      followers: data.followers || 0,
      shares: data.shares || 0,
      source: data.source || 'Tech News',
      category: data.category || 'Tech',
    };
  }
  
  // MONGODB ACTIVE CRUD
  if (DATABASE_TYPE === 'mongodb' && mongoClient) {
    const db = mongoDb || mongoClient.db(process.env.MONGODB_DB_NAME || 'shouvik_portfolio');
    const collection = db.collection<Article>('articles');
    const art = await collection.findOne({ slug });
    
    if (!art) return null; // Disable mock fallback!
    
    return {
      id: art._id.toString(),
      title: art.title,
      slug: art.slug,
      description: art.description,
      content: art.content,
      image: art.image,
      publishedAt: art.publishedAt,
      likes: art.likes || 0,
      followers: art.followers || 0,
      shares: art.shares || 0,
      source: art.source || 'Tech News',
      category: art.category || 'Tech',
    };
  }

  return null;
}

/**
 * Inserts a newly generated AI article directly into the active database.
 */
export async function saveArticle(article: Omit<Article, 'id'>): Promise<string> {
  // SUPABASE ACTIVE CRUD
  if (DATABASE_TYPE === 'supabase') {
    if (!supabaseClient) throw new Error("Supabase is not initialized. Cannot perform direct DB insert.");
    
    const { data, error } = await supabaseClient
      .from('articles')
      .insert([{
        title: article.title,
        slug: article.slug,
        description: article.description,
        content: article.content,
        image: article.image,
        published_at: article.publishedAt,
        likes: article.likes,
        followers: article.followers,
        shares: article.shares,
        source: article.source,
        category: article.category,
      }])
      .select('id')
      .single();
      
    if (error) {
      console.error("❌ Real Supabase saveArticle Error:", error);
      throw error;
    }
    return data.id;
  }
  
  // MONGODB ACTIVE CRUD
  if (DATABASE_TYPE === 'mongodb') {
    if (!mongoClient) throw new Error("MongoDB is not initialized. Cannot perform direct DB insert.");
    
    const db = mongoDb || mongoClient.db(process.env.MONGODB_DB_NAME || 'shouvik_portfolio');
    const collection = db.collection('articles');
    const { _id, ...insertData } = article as any;
    const result = await collection.insertOne(insertData);
    return result.insertedId.toString();
  }
  
  throw new Error("Invalid database driver selection.");
}

/**
 * Increments the interaction counts (likes, followers, shares) of an article by slug.
 */
export async function incrementArticleInteraction(slug: string, field: 'likes' | 'followers' | 'shares'): Promise<number> {
  // SUPABASE ACTIVE CRUD
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data: fetchVal, error: fetchErr } = await supabaseClient
      .from('articles')
      .select(field)
      .eq('slug', slug)
      .single();
      
    if (fetchErr) {
      console.error("❌ Real Supabase fetch interaction error:", fetchErr);
      throw fetchErr;
    }
    
    const newVal = (fetchVal[field] || 0) + 1;
    
    const { error: updateErr } = await supabaseClient
      .from('articles')
      .update({ [field]: newVal })
      .eq('slug', slug);
      
    if (updateErr) {
      console.error("❌ Real Supabase update interaction error:", updateErr);
      throw updateErr;
    }
    return newVal;
  }
  
  // MONGODB ACTIVE CRUD
  if (DATABASE_TYPE === 'mongodb' && mongoClient) {
    const db = mongoDb || mongoClient.db(process.env.MONGODB_DB_NAME || 'shouvik_portfolio');
    const collection = db.collection('articles');
    const result = await collection.findOneAndUpdate(
      { slug },
      { $inc: { [field]: 1 } },
      { returnDocument: 'after' }
    );
    
    return result ? (result as any)[field] : 0;
  }

  return 0;
}

/**
 * Advanced real-time search engine query for articles in Supabase/MongoDB.
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return getArticles();

  let liveArticles: Article[] = [];

  // ==========================================
  // GOOGLE NEWS RSS LIVE INTERNET SEARCH
  // ==========================================
  try {
    const parser = new Parser({
      customFields: {
        item: ['media:content', 'description']
      }
    });
    
    // Construct Google News RSS query URL (English, Global)
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(cleanQuery)}&hl=en-US&gl=US&ceid=US:en`;
    const feed = await parser.parseURL(rssUrl);
    
    liveArticles = feed.items.slice(0, 10).map((item, index) => {
      // Create a slug from title
      const slug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `live-article-${index}`;
      
      let img = '/assets/global-news.jpg'; // default
      if (item.content && item.content.includes('<img')) {
        const imgMatch = item.content.match(/src="([^"]+)"/);
        if (imgMatch) img = imgMatch[1];
      } else if (item.contentSnippet && item.contentSnippet.includes('<img')) {
        const imgMatch = item.contentSnippet.match(/src="([^"]+)"/);
        if (imgMatch) img = imgMatch[1];
      }

      return {
        id: `live-${Date.now()}-${index}`,
        title: item.title || 'Untitled Article',
        slug,
        description: item.contentSnippet?.replace(/<[^>]+>/g, '').slice(0, 150) + '...' || 'No description available.',
        content: item.content || item.contentSnippet || '',
        image: img,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        likes: Math.floor(Math.random() * 500) + 10,
        followers: Math.floor(Math.random() * 1000) + 50,
        shares: Math.floor(Math.random() * 200),
        source: item.creator || (item as any).source || 'Google News',
        category: 'Web Search',
      } as Article;
    });
  } catch (error) {
    console.warn("⚠️ Failed to fetch live Google News RSS:", error);
  }

  let dbArticles: Article[] = [];

  // SUPABASE ACTIVE SEARCH CRUD (Case-insensitive, partial match across all columns)
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('articles')
      .select('*')
      .or(`title.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,content.ilike.%${cleanQuery}%,category.ilike.%${cleanQuery}%,source.ilike.%${cleanQuery}%`)
      .order('published_at', { ascending: false });

    if (error) {
      console.error("❌ Real Supabase searchArticles Error:", error);
    } else if (data && data.length > 0) {
      dbArticles = data.map((art: any) => ({
        id: art.id,
        title: art.title,
        slug: art.slug,
        description: art.description,
        content: art.content,
        image: art.image,
        publishedAt: art.published_at || art.publishedAt,
        likes: art.likes || 0,
        followers: art.followers || 0,
        shares: art.shares || 0,
        source: art.source || 'Tech News',
        category: art.category || 'Tech',
      }));
    }
  }

  // MONGODB ACTIVE SEARCH CRUD
  if (DATABASE_TYPE === 'mongodb' && mongoClient) {
    const db = mongoDb || mongoClient.db(process.env.MONGODB_DB_NAME || 'shouvik_portfolio');
    const collection = db.collection<Article>('articles');
    const searchRegex = new RegExp(cleanQuery, 'i');
    
    const queryObj = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { content: searchRegex },
        { category: searchRegex },
        { source: searchRegex }
      ]
    };

    const data = await collection.find(queryObj).sort({ publishedAt: -1 }).toArray();

    if (data && data.length > 0) {
      dbArticles = data.map((art: any) => ({
        id: art._id.toString(),
        title: art.title,
        slug: art.slug,
        description: art.description,
        content: art.content,
        image: art.image,
        publishedAt: art.publishedAt,
        likes: art.likes || 0,
        followers: art.followers || 0,
        shares: art.shares || 0,
        source: art.source || 'Tech News',
        category: art.category || 'Tech',
      }));
    }
  }

  // Merge the Live Internet Articles with the local DB articles
  return [...liveArticles, ...dbArticles];
}

/**
 * =========================================================================
 *  PHASE 2 - REAL-TIME SOCIAL MEDIA SYNC DATABASE QUERIES
 * =========================================================================
 */

export async function getSocialStats(): Promise<SocialStat[]> {
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('social_stats')
      .select('*')
      .order('raw_count', { ascending: false });
      
    if (error) {
      console.error("❌ Real Supabase getSocialStats Error:", error);
      throw error;
    }
    
    if (!data || data.length === 0) return [];
    
    return data.map((stat: any) => ({
      id: stat.id,
      name: stat.name,
      avatar: stat.avatar,
      followers: stat.followers,
      rawCount: stat.raw_count || 0,
      updatedAt: stat.updated_at
    }));
  }
  return [];
}

export async function getSocialPosts(limit = 8): Promise<SocialPost[]> {
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("❌ Real Supabase getSocialPosts Error:", error);
      throw error;
    }
    
    if (!data || data.length === 0) return [];
    
    return data.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description || '',
      source: post.source,
      url: post.url,
      imageUrl: post.image_url || '',
      type: post.type as any,
      createdAt: post.created_at
    }));
  }
  return [];
}

export async function upsertSocialPost(post: Omit<SocialPost, 'id'>): Promise<void> {
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { error } = await supabaseClient
      .from('social_posts')
      .upsert({
        title: post.title,
        description: post.description,
        source: post.source,
        url: post.url,
        image_url: post.imageUrl,
        type: post.type,
        created_at: post.createdAt || new Date().toISOString()
      }, { onConflict: 'url' });
      
    if (error) {
      console.error("❌ Real Supabase upsertSocialPost Error:", error);
      throw error;
    }
  }
}

export async function upsertSocialStat(stat: SocialStat): Promise<void> {
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { error } = await supabaseClient
      .from('social_stats')
      .upsert({
        id: stat.id,
        name: stat.name,
        avatar: stat.avatar,
        followers: stat.followers,
        raw_count: stat.rawCount,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      
    if (error) {
      console.error("❌ Real Supabase upsertSocialStat Error:", error);
      throw error;
    }
  }
}

export async function pruneSocialPosts(maxLimit = 50): Promise<number> {
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('social_posts')
      .select('id')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("❌ Supabase prune error:", error);
      throw error;
    }
    
    if (data && data.length > maxLimit) {
      const idsToDelete = data.slice(maxLimit).map((p: any) => p.id);
      
      const { error: delErr } = await supabaseClient
        .from('social_posts')
        .delete()
        .in('id', idsToDelete);
        
      if (delErr) {
        console.error("❌ Supabase delete pruning error:", delErr);
        throw delErr;
      }
      return idsToDelete.length;
    }
  }
  return 0;
}

export async function getProjects(): Promise<Project[]> {
  if (DATABASE_TYPE === 'supabase' && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .order('featured', { ascending: false });
      
    if (error) {
      console.error("❌ Real Supabase getProjects Error:", error);
      throw error;
    }
    
    if (!data || data.length === 0) return [];
    
    return data.map((proj: any) => ({
      id: proj.id,
      title: proj.title,
      description: proj.description || '',
      techStack: proj.tech_stack || [],
      imageUrl: proj.image_url || '',
      demoUrl: proj.demo_url || '',
      featured: proj.featured || false,
      details: proj.details,
      createdAt: proj.created_at
    }));
  }
  return [];
}
