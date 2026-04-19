import Button from '../components/Button'

export default function Configurateur() {
  return (
    <section className="bg-base text-textMain min-h-screen py-32 text-center px-6">
      <h2 className="text-4xl font-serif mb-6 text-textMain">
        Eyewear Configurator
      </h2>
      <p className="max-w-xl mx-auto text-textSubtle mb-12 leading-relaxed">
        Create the eyewear that reflects you: choose the frame, lenses,
        temples and finishes according to your desires.
      </p>

      <Button variant="outline">Start Customization</Button>
    </section>
  )
}
