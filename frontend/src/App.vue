<script setup>
import { ref } from "vue";
import Keypad from "./components/Keypad.vue";
import { decrypt, encrypt } from "./utils";

const digits = ref();
const password = ref("");
const maskedPassword = ref("");

function handlePasswordUpdate(digitsEntered) {
  password.value = digitsEntered;
  maskedPassword.value = password.value.length
    ? "*".repeat(password.value.length)
    : "";
}

const baseURL = import.meta.env.VITE_API_URL;

async function handleLogin() {
  try {
    const encryptedPassword = await encrypt({ password: password.value });
    const response = await fetch(`${baseURL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(encryptedPassword),
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
    const user = await response.json();
    const username = `${user.firstName} ${user.lastName}`;
    alert("Welcome! You are now logged in as " + username);
  } catch (error) {
    console.log(error);
    alert("An error occurred. Please try again.");
  }
}

(async () => {
  try {
    const response = await fetch(`${baseURL}/api/digits`);
    const data = await response.json();
    const rawDigits = await decrypt(data.encryptedData, data.authTag);
    digits.value = rawDigits;
  } catch (error) {
    console.log(error);
    alert("An error occurred. Please try again.");
  }
})();
</script>

<template>
  <div class="container">
    <header class="title">Virtual Keypad</header>
    <p class="subtitle">Enter your password on the virtual keypad:</p>
    <input
      type="password"
      class="password-display"
      v-model="maskedPassword"
      disabled
    />
    <Keypad
      :digits="digits"
      @update:password="handlePasswordUpdate"
      @login="handleLogin"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
}
.title {
  font-size: 1.8em;
  font-weight: bold;
  color: #333;
}
.subtitle {
  font-size: 1em;
  color: #666;
}
.password-display {
  padding: 0.8rem;
  width: 80%;
  text-align: center;
  background-color: #f9f9f9;
  border: 2px solid #ccc;
  border-radius: 0.5em;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  outline: none;
}
</style>
