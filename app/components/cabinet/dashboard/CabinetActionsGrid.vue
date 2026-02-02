<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Мои заказы -->
    <CabinetActionCard
      title="Мои заказы"
      description="Ваш обед на сегодня и история заказов"
      to="/cabinet/my-orders"
      linkText="Посмотреть"
      linkVariant="link"
    >
      <template #icon>
        <!-- SVG 1:1 из твоего исходника -->
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </template>
    </CabinetActionCard>

    <!-- Заказ на неделю -->
    <CabinetActionCard
      title="Заказ на неделю"
      description="Выбор блюд на следующую неделю"
      to="/cabinet/week-order"
      linkText="Сделать заказ"
      linkVariant="link"
    >
      <template #icon>
        <!-- SVG 1:1 из твоего исходника -->
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </template>
    </CabinetActionCard>

    <!-- Меню -->
    <CabinetActionCard
      title="Посмотреть меню"
      description="Актуальное меню на текущую неделю"
      to="/cabinet/menu"
      linkText="Открыть меню"
      linkVariant="link"
    >
      <template #icon>
        <!-- SVG 1:1 из твоего исходника -->
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </template>
    </CabinetActionCard>

    <!-- Мои отзывы (в исходнике вся карточка = NuxtLink, и внутри span "Посмотреть →") -->
    <CabinetActionCard
      title="Мои отзывы"
      description="Ваши отзывы и ответы администрации"
      to="/cabinet/feedback"
      linkText="Посмотреть"
      linkVariant="span"
      :badge="newRepliesCount"
    >
      <template #icon>
        <!-- SVG 1:1 из твоего исходника -->
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </template>
    </CabinetActionCard>
  </div>
</template>

<script setup lang="ts">
import CabinetActionCard from './CabinetActionCard.vue'

defineProps<{
  newRepliesCount: number
}>()
</script>
