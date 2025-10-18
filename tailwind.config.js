/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-bg': '#343541',
        'chat-sidebar': '#202123',
        'chat-input': '#40414f',
        'chat-message-user': '#444654',
        'chat-message-ai': '#343541',
        'chat-border': '#565869',
        'chat-text': '#ececf1',
        'chat-text-secondary': '#8e8ea0',
      }
    },
  },
  plugins: [],
}
