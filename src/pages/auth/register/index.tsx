import { useState } from "react";
import { Card } from "flowbite-react";
import { TextInput, Button } from "flowbite-react";
import { auth, googleProvider } from "../../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Email/password registration
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setError("");
      router.push("/dashboard"); // redirect after register
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Google registration/login
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setError("");
      router.push("/dashboard"); // redirect after Google login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

        {!user ? (
          <>
            <form onSubmit={handleRegister} className="space-y-4">
              <TextInput
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextInput
                id="password"
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit"  fullSized>
                Register
              </Button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Sign-up Button */}
            <Button
              onClick={handleGoogleRegister}
              color="light"
              className="flex items-center justify-center gap-2 w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                className="w-5 h-5"
              >
                <path
                  fill="#4285F4"
                  d="M488 261.8c0-17.8-1.5-35-4.3-51.8H249v98h135c-5.8 31.2-23.1 57.5-49 75v62h79c46-42.3 74-104.6 74-183.2z"
                />
                <path
                  fill="#34A853"
                  d="M249 492c66.2 0 121.7-21.9 162.2-59.5l-79-62c-21.9 14.8-49.9 23.5-83.2 23.5-63.9 0-118.1-43.2-137.6-101.1h-82v63.6C70.4 439.7 152.9 492 249 492z"
                />
                <path
                  fill="#FBBC05"
                  d="M111.4 292.9c-5.2-15.2-8.2-31.3-8.2-48s3-32.8 8.2-48v-63.6h-82C19.3 171.2 0 208.6 0 249c0 40.4 19.3 77.8 49.4 101.7l62-48z"
                />
                <path
                  fill="#EA4335"
                  d="M249 97.8c36 0 68.4 12.4 93.9 36.9l70.7-70.7C370.7 27.2 315.2 0 249 0 152.9 0 70.4 52.3 49.4 147.3l62 48c19.5-57.9 73.7-101.1 137.6-101.1z"
                />
              </svg>
              Sign up with Google
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-medium mb-2">
              Welcome, {user.displayName || user.email}
            </p>
            <img
              src={user.photoURL || ""}
              alt="profile"
              className="w-16 h-16 rounded-full mx-auto"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </Card>
    </div>
  );
}
