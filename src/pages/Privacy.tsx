export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground text-sm">
        <p>Last updated: January 2026</p>
        <h2 className="text-foreground text-lg font-semibold">1. Collection of Data</h2>
        <p>We collect basic contact information (name, email, discord ID) solely for the purpose of processing your application to the club.</p>
        
        <h2 className="text-foreground text-lg font-semibold">2. Usage</h2>
        <p>We do not sell your data. We use it to contact you regarding membership status and club updates.</p>
        
        <h2 className="text-foreground text-lg font-semibold">3. Storage</h2>
        <p>Data is stored securely using industry-standard encryption.</p>
      </div>
    </div>
  );
}