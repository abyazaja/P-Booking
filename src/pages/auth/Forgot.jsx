export default function Forgot() {
  return (
    <form className="w-full max-w-md">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center text-gray-800">
        Forgot Your Password?
      </h2>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your email address and we’ll send you a link to reset your password.
      </p>

      <div className="mb-5">
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full border rounded px-3 py-2 bg-gray-50 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-ballgreen focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-ballgreen hover:bg-ballgreen/90 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
      >
        Send Reset Link
      </button>

      <div className="mt-6 text-center text-sm">
        <a href="/login" className="text-ballorange hover:text-ballorange/80 hover:underline">
          Back to Login
        </a>
      </div>
    </form>
  );
}
