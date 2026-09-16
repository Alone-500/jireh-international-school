import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home, { AboutPage, AcademicsPage, AdmissionsPage, AdminPage, ContactPage, GalleryPage } from "./pages/Home";

function AdminRoute({ section }: { section?: string }) {
  return <AdminPage section={section} />;
}

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/about" component={AboutPage} />
    <Route path="/academics" component={AcademicsPage} />
    <Route path="/admissions" component={AdmissionsPage} />
    <Route path="/gallery" component={GalleryPage} />
    <Route path="/contact" component={ContactPage} />
    <Route path="/admin" component={() => <AdminRoute />} />
    <Route path="/admin/homepage" component={() => <AdminRoute section="homepage" />} />
    <Route path="/admin/about" component={() => <AdminRoute section="about" />} />
    <Route path="/admin/academics" component={() => <AdminRoute section="academics" />} />
    <Route path="/admin/admissions" component={() => <AdminRoute section="admissions" />} />
    <Route path="/admin/gallery" component={() => <AdminRoute section="gallery" />} />
    <Route path="/admin/announcements" component={() => <AdminRoute section="announcements" />} />
    <Route path="/admin/settings" component={() => <AdminRoute section="settings" />} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
