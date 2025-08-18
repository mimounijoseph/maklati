import React from 'react'

function Footer() {
  return (
    <footer className="bg-amber-500 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Logo + description */}
          <div>
            <h1 className="text-2xl font-bold" style={{fontFamily:"Sacramento"}}>maklati</h1>
            <p className="mt-3 text-sm text-gray-200">
              Your favorite snack online 🍔🍟. Order easily and enjoy wherever you are.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-yellow-300">Home</a>
              </li>
              <li>
                <a href="/snack" className="hover:text-yellow-300">Snacks</a>
              </li>
              <li>
                <a href="/about" className="hover:text-yellow-300">About</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-yellow-300">Contact</a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-300">Facebook</a>
              <a href="#" className="hover:text-yellow-300">Instagram</a>
              <a href="#" className="hover:text-yellow-300">TikTok</a>
            </div>
          </div>
        </div>

        {/* Ligne en bas */}
<div className="border-t border-red-500 py-4 text-center text-sm text-gray-200">
  <p>
    © {new Date().getFullYear()} Maklati. Tous droits réservés.
  </p>
  <div className="mt-2 space-x-4">
    <a href="/conditions" className="hover:underline text-gray-200">Conditions d'utilisation</a>
    <a href="/confidentialite" className="hover:underline text-gray-200">Politique de confidentialité</a>
    <a href="/mentions-legales" className="hover:underline text-gray-200">Mentions légales</a>
  </div>
</div>

      </div>
    </footer>
  )
}

export default Footer
