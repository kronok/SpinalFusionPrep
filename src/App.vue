<template>
    <div class="min-h-screen bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-0">
        <header class="border-b border-surface-200 bg-surface-0 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <nav ref="navRef" class="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
                <div class="flex items-center gap-3">
                    <img width="40" height="40" src="/logo.svg" alt="Spinal Fusion Prep" />
                    <div>
                        <p class="text-lg font-semibold">Spinal Fusion Prep</p>
                        <p class="text-xs text-surface-500 dark:text-surface-300">Guidance from a fellow patient</p>
                    </div>
                </div>
                <button
                    type="button"
                    class="cursor-pointer text-surface-700 transition hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:text-surface-100 lg:hidden"
                    aria-label="Toggle navigation menu"
                    @click="toggleMobileMenu"
                >
                    <i class="pi pi-bars text-2xl" />
                </button>
                <div
                    :class="[
                        'menu-container absolute left-0 top-full z-50 w-full border-b border-surface-200 bg-surface-0 px-6 py-4 shadow-lg dark:border-surface-800 dark:bg-surface-900 lg:static lg:flex lg:w-auto lg:items-center lg:gap-6 lg:border-0 lg:p-0 lg:shadow-none',
                        isMobileMenuOpen ? 'block' : 'hidden'
                    ]"
                >
                    <ul class="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                        <li>
                            <button
                                type="button"
                                class="rounded-full px-4 py-2 text-sm font-semibold transition"
                                :class="buttonClasses('All')"
                                @click="selectCategory('All')"
                            >
                                All
                            </button>
                        </li>
                        <li v-for="category in categories" :key="category">
                            <button
                                type="button"
                                class="rounded-full px-4 py-2 text-sm font-semibold transition"
                                :class="buttonClasses(category)"
                                @click="selectCategory(category)"
                            >
                                {{ category }}
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>

        <main>
           <section class="bg-gradient-to-b from-primary-50 via-surface-50 to-surface-0 py-3 dark:from-surface-900 dark:via-surface-900 dark:to-surface-950">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:px-8 lg:flex-row lg:items-center">
        <div class="flex-1 space-y-6">
            <!--
            <span class="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-500/10 dark:text-primary-200">
                Preparing for Surgery Together
            </span>
            -->
            <h1 class="text-3xl font-bold leading-tight sm:text-4xl">
                Curated essentials to help you feel ready for spinal fusion surgery
            </h1>

            <p class="text-base leading-relaxed text-surface-600 dark:text-surface-300">
                Before you buy anything online, I strongly recommend visiting your local medical supply store. Many big items can be rented instead of purchased, which is ideal if you’ll only need them for a short time. If I could do it all over again, I’d start by going in person and trying out different recliners to find the one that felt truly comfortable after surgery.
            </p>

            <p class="text-base leading-relaxed text-surface-600 dark:text-surface-300">
                The products on this site are what I or others have relied on during recovery. Use them as a guide and a starting point to build a support kit that helps you stay safe, comfortable, and as independent as possible alongside the advice of your surgeon or care team.
            </p>

<!--            <div class="flex flex-wrap gap-3">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                    @click="selectCategory('All')"
                >
                    Explore All Products
                    <i class="pi pi-arrow-right" />
                </button>
                <a
                    href="#products"
                    class="inline-flex items-center gap-2 rounded-full border border-surface-300 px-5 py-3 text-sm font-semibold text-surface-700 transition hover:border-primary-400 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:border-surface-700 dark:text-surface-200"
                >
                    Jump to Product List
                    <i class="pi pi-list" />
                </a>
            </div>-->
        </div>
        <!--
        <div class="flex-1">
            <div class="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-xl dark:border-surface-700 dark:bg-surface-900">
                <img src="/images/placeholder.png" alt="Comforting items prepared on a table" class="h-full w-full object-cover" />
            </div>
        </div>
        -->
    </div>
</section>


            <section id="products" class="bg-surface-0 py-6 dark:bg-surface-950">
                <div class="mx-auto max-w-6xl px-6 md:px-8">
                    <div class="flex flex-col gap-4 pb-6">
                        <h2 class="text-2xl font-semibold">{{ headingText }}</h2>
                        <p class="text-sm text-surface-600 dark:text-surface-300">
                            {{ descriptionText }}
                        </p>
                    </div>
                </div>
            </section>

            <ProductList :products="filteredProducts" />
        </main>

        <footer class="border-t border-surface-200 bg-surface-0 py-8 text-center text-sm text-surface-500 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-300">
            Some products may contain affiliate links, which help support this project at no extra cost to you.<br>
            © {{ new Date().getFullYear() }} Spinal Fusion Prep. ❤️ Created by a fellow spinal fusion patient (T5-L3 fusion, 2024, Dr. Hey).
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import ProductList from './components/ProductList.vue';
import type { Product } from './data/products';
import { products } from './data/products';

const selectedCategory = ref<'All' | string>('All');
const isMobileMenuOpen = ref(false);
const navRef = ref<HTMLElement | null>(null);

const categories = computed(() => {
    const categorySet = new Set<string>();
    products.forEach((product: Product) => {
        product.categories.forEach((category: string) => categorySet.add(category));
    });
    return Array.from(categorySet).sort();
});

const filteredProducts = computed<Product[]>(() => {
    if (selectedCategory.value === 'All') {
        return products;
    }

    return products.filter((product: Product) => product.categories.includes(selectedCategory.value));
});

const headingText = computed(() =>
    selectedCategory.value === 'All'
        ? 'All recommended products'
        : `${selectedCategory.value} essentials`
);

const descriptionText = computed(() =>
    selectedCategory.value === 'All'
        ? 'Browse every item that helped me prepare for spinal fusion surgery, from comfort and mobility to vitamins and daily necessities.'
        : `Focused recommendations tailored to ${selectedCategory.value.toLowerCase()} needs during spinal fusion recovery.`
);

function selectCategory(category: string) {
    selectedCategory.value = category;
    closeMobileMenu();
}

function buttonClasses(category: string) {
    const isActive = selectedCategory.value === category;
    return [
        isActive
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
            : 'border border-transparent bg-transparent text-surface-600 hover:bg-primary-50 hover:text-primary-600 dark:text-surface-200 dark:hover:bg-primary-500/10 dark:hover:text-primary-200'
    ];
}

function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
    isMobileMenuOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
    if (!isMobileMenuOpen.value) {
        return;
    }

    const target = event.target as Node | null;
    if (target && navRef.value && !navRef.value.contains(target)) {
        closeMobileMenu();
    }
}

function handleResize() {
    if (window.innerWidth >= 1024) {
        closeMobileMenu();
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', handleResize);
});
</script>