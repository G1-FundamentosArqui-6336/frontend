import AppRoutes from './routes';
import { QueryProvider, AuthProvider } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AppShell() {
	return (
		<QueryProvider>
			<AuthProvider>
				<AppRoutes />
				<ToastContainer position="top-right" limit={3} />
			</AuthProvider>
		</QueryProvider>
	);
}
