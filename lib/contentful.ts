import { createClient } from 'contentful';
import { NavSection, MenuItem } from '../src/components/Layout';

// Prüfe, ob der Code auf der Serverseite ausgeführt wird
const isServer = typeof window === 'undefined';

// Initialisiere den Client nur auf der Serverseite
const client = isServer
  ? createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    })
  : null;

export async function fetchMenuData(entryId: string): Promise<NavSection[]> {
  try {
    // Überprüfe, ob wir uns auf der Serverseite befinden
    if (!isServer) {
      throw new Error('fetchMenuData kann nur auf der Serverseite ausgeführt werden');
    }

    if (!client) {
      throw new Error('Contentful Client wurde nicht initialisiert');
    }

    const entry = await client.getEntry(entryId);
    if (!entry?.fields?.items) {
      console.warn('Keine Menüpunkte im Eintrag gefunden');
      return [];
    }

    // Überprüfe die Datenstruktur
    if (!Array.isArray(entry.fields.items)) {
      console.warn('Unerwartetes Datenformat für items:', entry.fields.items);
      return [];
    }

    const items = entry.fields.items.map((item: any) => ({
      fields: {
        title: item.fields.title,
        url: item.fields.url,
      }
    })).filter(Boolean);

    return [{
      title: entry.fields.title || 'Main',
      items,
    }];
  } catch (error) {
    console.error('Fehler beim Abrufen der Menüdaten:', error);
    return [];
  }
}