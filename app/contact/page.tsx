export default function ContactPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">
        We'd love to hear from you. If you have any questions, feedback, or concerns, please don't hesitate to reach
        out.
      </p>
      <div className="bg-card rounded-lg p-6 shadow-sm mt-6">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground">support@nobaddays.app</p>
          </div>
          <div>
            <h3 className="font-medium">Support Hours</h3>
            <p className="text-muted-foreground">Monday - Friday: 9am - 5pm PST</p>
          </div>
        </div>
      </div>
    </div>
  )
}
