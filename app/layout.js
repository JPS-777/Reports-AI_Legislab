import { Inter } from 'next/font/google';
import './globals.css';

// Configuración de fuente Inter de Google Fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Mi Aplicación',
  description: 'Descripción de mi aplicación',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <main className="min-h-screen flex flex-col">
          {/* Aquí puedes agregar un header o navbar si lo necesitas */}
          <div className="flex-grow">
            {children}
          </div>
          {/* Aquí puedes agregar un footer si lo necesitas */}
        </main>
      </body>
    </html>
  );
}

