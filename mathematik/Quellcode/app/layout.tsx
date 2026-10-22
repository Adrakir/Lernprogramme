import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'MatheKompass · Mathematik Klasse 5',description:'Verstehen, üben und anwenden: Daten und Diagramme, große Zahlen, Runden, Zahlenstrahl, Einheiten und Kopfrechnen für Klasse 5 am Gymnasium. Mit interaktiven Erklärungen und schrittweisen Hilfen.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="de"><body>{children}</body></html>}
