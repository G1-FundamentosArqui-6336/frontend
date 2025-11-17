import AppRoutes from './routes';
import { QueryProvider, AuthProvider } from './providers';

export default function AppShell() {
	return (
		<QueryProvider>
			<AuthProvider>
				<AppRoutes />
			</AuthProvider>
		</QueryProvider>
	);
}
