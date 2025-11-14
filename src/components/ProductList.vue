<template>
    <section class="bg-surface-0 px-6 dark:bg-surface-950 md:px-12 lg:px-20">
        <div class="mx-auto max-w-6xl">
            <div v-if="products.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                />
            </div>
            <p v-else class="rounded-2xl border border-dashed border-surface-300 p-8 text-center text-surface-600 dark:border-surface-700 dark:text-surface-300">
                No products found in this category right now. Please explore another category to discover more helpful items.
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { Product } from '../data/products';
import ProductCard from './Product.vue';

defineProps<{
    products: Product[];
}>();
</script>