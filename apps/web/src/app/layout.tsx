import './fonts.css';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export const metadata = {
  title: 'Katalog',
  description: 'Каталог книг и трекер чтения'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="app-shell">
          <Sidebar />
          <div className="app-main">
            <Topbar />
            <main className="content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}