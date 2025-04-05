import { fetchMenuData } from '../../lib/contentful';
import { NavSection } from '../components/Layout';

export async function getMenuData(): Promise<NavSection[]> {
  try {
    const menuData = await fetchMenuData('3w92kKa9R766uKF5maFNky');
    console.log('Fetched menu data:', menuData);
    return menuData;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [];
  }
}

export async function getFooterData(): Promise<NavSection[]> {
  try {
    const footerData = await fetchMenuData('5lQO6PPLuT8YOeZp6IociC');
    console.log('Fetched footer data:', footerData);
    return footerData;
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return [];
  }
}