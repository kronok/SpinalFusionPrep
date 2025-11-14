<template>
    <article
        class="flex flex-col h-full overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-surface-700 dark:bg-surface-900"
    >
        <a
            :href="product.link"
            target="_blank"
            rel="noopener"
            class="relative flex h-48 items-center justify-center overflow-hidden bg-white transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0"
        >
            <img
                :src="imageSrc"
                :alt="product.name"
                class="max-h-full max-w-full object-contain"
            />
            <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                <span
                    v-for="category in product.categories"
                    :key="category"
                    class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:bg-primary-500/10 dark:text-primary-200"
                >
                    {{ category }}
                </span>
            </div>
        </a>
        <div class="flex flex-1 flex-col gap-4 p-6">
            <header class="space-y-2">
                <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0">
                    {{ product.name }}
                </h3>
                <p class="text-sm leading-relaxed text-surface-600 dark:text-surface-300">
                    {{ product.description }}
                </p>
            </header>
            <div class="mt-auto">
                <a
                    :href="product.link"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                >
                    View on Amazon
                    <i class="pi pi-external-link text-xs"></i>
                </a>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '../data/products';

const props = defineProps<{
    product: Product;
}>();

const imageSrc = computed(() => `/images/${props.product.image}`);
</script>