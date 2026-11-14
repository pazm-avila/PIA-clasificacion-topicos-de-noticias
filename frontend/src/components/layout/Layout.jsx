import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-5 pb-12">{children}</main>
      <Footer />
    </div>
  );
}