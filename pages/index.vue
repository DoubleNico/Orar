<template>
  <div>
    <h1>Color mode: {{ colorModeText }}</h1>
    <button @click="changeMode">{{ colorModeText }}</button>
    <a
      v-for="lang in availableLocales"
      :key="lang.code"
      href="#"
      @click.prevent.stop="setLocale(lang.code)"
      >{{ lang.name }}</a
    >
    <p>{{ $t('hello') }}</p>
    <StructureButton />
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return locales.value.filter((i: { code: string }) => i.code !== locale.value)
})

const colorMode = useColorMode()
const colorModeText = ref('')

const updateColorModeText = () => {
  if (colorMode.value === 'light') colorModeText.value = 'light'
  else if (colorMode.value === 'dark') colorModeText.value = 'dark'
  else colorModeText.value = 'contrast'
}

const changeMode = () => {
  if (colorMode.value === 'light') colorMode.value = 'dark'
  else if (colorMode.value === 'dark') colorMode.value = 'contrast'
  else colorMode.value = 'light'
  colorMode.preference = colorMode.value
  updateColorModeText()
}

onMounted(() => {
  updateColorModeText()
})
</script>

<style>
@import 'assets/css/theme.css';
</style>
