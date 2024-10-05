<template>
  <div>
    <h1>Color mode: {{ $colorMode.value }}</h1>
    <button @click="changeMode">{{ $colorMode.value }}</button>
    <a
      v-for="lang in availableLocales"
      :key="lang.code"
      href="#"
      @click.prevent.stop="setLocale(lang.code)"
      >{{ lang.name }}</a
    >
    <p>{{ $t('hello') }}</p>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const availableLocales = computed(() => {
  return locales.value.filter((i: { code: string }) => i.code !== locale.value)
})

const colorMode = useColorMode()

const changeMode = () => {
  if (colorMode.value === 'light') colorMode.value = 'dark'
  else if (colorMode.value === 'dark') colorMode.value = 'contrast'
  else colorMode.value = 'light'
  colorMode.preference = colorMode.value
}
</script>

<style>
.dark-mode {
  @apply text-white bg-background-dark;
}

.light-mode {
  @apply text-black bg-background-light;
}

.contrast-mode {
  @apply text-white bg-background-contrast;
}
</style>
