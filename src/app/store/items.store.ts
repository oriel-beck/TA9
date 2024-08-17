import { HttpClient } from "@angular/common/http";
import { SortDirection } from "@angular/material/sort";
import { computed, inject } from "@angular/core";

import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";

import { debounceTime, distinctUntilChanged, pipe } from "rxjs";

import { Views } from "../enums";
import type { Item } from "../types";

export interface ItemsState {
    items: Item[];
    query: string;
    view: Views;

    pageSize: number;
    pageNumber: number;

    sortColumn: string | null;
    sortDirection: SortDirection | null;
}

const initialState: ItemsState = {
    items: [],
    query: "",
    view: Views.Table,
    pageNumber: 0,
    pageSize: 10,
    sortColumn: null,
    sortDirection: null
}

export const ItemsStore = signalStore(
    withState(initialState),
    withHooks((store, httpClient = inject(HttpClient)) => ({
        onInit: () => {
            httpClient.get<Item[]>("/data.json").subscribe({
                next: (items) => {
                    patchState(store, { items: items.map((item, _index) => ({ ...item, _index })) });
                },
                error: (e) => {
                    console.error("Failed loading items", e);
                    patchState(store, { items: [] });
                }
            });
        },
    })),
    withMethods((store) => ({
        search: rxMethod<string>(pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tapResponse({
                next: (query) => patchState(store, { query }),
                // This cannot error
                error: () => null
            })
        )),
        changeView(newView: Views) {
            patchState(store, { view: newView });
        },
        changePage(pageNumber: number, pageSize: number) {
            if (store.pageNumber() !== pageNumber) patchState(store, { pageNumber });
            if (store.pageSize() !== pageSize) patchState(store, { pageSize });
        },
        changeSort(column: string | null, direction: SortDirection | null) {
            if (column && !(column in store.items().at(0)!)) return; // don't try to sort on invalid columns
            patchState(store, { sortColumn: column, sortDirection: direction });
        },
        addItem(item: Partial<Item>) {
            item._index = store.items().length;
            item.created_at = new Date().getTime().toString();
            item.updated_at = item.created_at;
            store.items().push(item as Item);
            // changes the ref and forces a re-computation
            patchState(store, { items: [...store.items()] })
        },
        editItem(idx: number, item: Partial<Item>) {
            const currentItem = store.items()[idx];
            if (!currentItem) return;
            item.updated_at = new Date().getTime().toString();
            item.created_at = store.items()[idx].created_at;
            store.items()[idx] = item as Item;
            // changes the ref and forces a re-computation
            patchState(store, { items: [...store.items()] })
        }
    })),
    withComputed((store) => ({
        displayedItems: computed(() => {
            let items = [...store.items()];
            const sortDirection = store.sortDirection();
            const sortColumn = store.sortColumn();
            if (store.view() === Views.Table && sortColumn && sortDirection) {
                items = items.sort((a, b) => {
                    const keyA = a[sortColumn as keyof typeof a];
                    const keyB = b[sortColumn as keyof typeof b];

                    let valA: Date | string = String(keyA).toLowerCase();
                    let valB: Date | string = String(keyB).toLowerCase();

                    if (isTimestamp(keyA) && isTimestamp(keyB)) {
                        valA = new Date(Number(keyA));
                        valB = new Date(Number(keyB));
                    }

                    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
                    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            const query = store.query().toLowerCase();
            if (query) {
                items = items.filter(i => i.name.toLowerCase().startsWith(query));
            }

            const count = items.length;
            if (store.view() === Views.Table) items = items.splice(store.pageNumber() * store.pageSize(), store.pageSize());

            return { items, count };
        }),
    }))
)

const isTimestamp = (str: string | number) => !isNaN(Number(str));