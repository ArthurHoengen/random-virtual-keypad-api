<script setup>
import { ref } from "vue";

const {
  digits: keypadLayout = {
    digits: [],
  },
} = defineProps(["digits"]);

const emit = defineEmits(["update:password", "login"]);

const enteredDigits = ref([]);

function addDigitToPassword(digitPair) {
  enteredDigits.value.push(digitPair);
  emit("update:password", enteredDigits.value);
}

function clearEnteredDigits() {
  enteredDigits.value = [];
  emit("update:password", enteredDigits.value);
}

function login() {
  emit("login");
}
</script>

<template>
  <div class="keypad">
    <div v-for="digit in keypadLayout.digits" :key="digit" class="key">
      <button class="key-button" @click="addDigitToPassword(digit)">
        {{ digit[0] }} or {{ digit[1] }}
      </button>
    </div>
    <button class="clear-button" @click="clearEnteredDigits">Clear</button>
  </div>
  <button class="enter-button" @click="login">Enter</button>
</template>

<style scoped>
.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  padding: 1rem;
  max-width: 320px;
  margin: auto;
}
.key {
  display: flex;
  justify-content: center;
  align-items: center;
}
.key-button {
  padding: 1rem;
  font-size: 1.2em;
  width: 100%;
  text-align: center;
  cursor: pointer;
  background-color: #f8f9fa;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}
.key-button:hover {
  background-color: #e9ecef;
}
.key-button:active {
  background-color: #dee2e6;
  transform: scale(0.98);
}
.clear-button,
.enter-button {
  padding: 1rem;
  font-size: 1.2em;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
}
.clear-button {
  background-color: #e74c3c;
  color: white;
}
.clear-button:hover {
  background-color: #c0392b;
}
.enter-button {
  width: 90%;
  background-color: #ff8c00;
  color: white;
}
.enter-button:hover {
  background-color: #e67e00;
}
.clear-button:active,
.enter-button:active {
  transform: scale(0.97);
}
</style>
