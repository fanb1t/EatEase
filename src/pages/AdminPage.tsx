import { ImagePlus, Plus, Save, Utensils } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { eatEaseApi } from "../services/eatEaseApi";
import { t } from "../i18n/messages";
import type { DiningTable, Locale, MenuCategory, MenuItem } from "../types";
import { localize, money } from "../utils/format";

type Props = {
  locale: Locale;
};

const emptyCategory = (): MenuCategory => ({
  id: "",
  name: { th: "", en: "" },
  sortOrder: 10,
  isActive: true,
});

const emptyItem = (categoryId = ""): Omit<MenuItem, "id"> => ({
  categoryId,
  name: { th: "", en: "" },
  description: { th: "", en: "" },
  price: 0,
  imageUrl: "",
  thumbnailUrl: "",
  isAvailable: true,
  isRecommended: false,
});

export function AdminPage({ locale }: Props) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [categoryDraft, setCategoryDraft] = useState<MenuCategory>(emptyCategory);
  const [itemDraft, setItemDraft] = useState<Omit<MenuItem, "id">>(emptyItem());
  const [tableDraft, setTableDraft] = useState<DiningTable>({ id: "", slug: "", number: "", isActive: true });

  async function load() {
    const [menu, tableRows] = await Promise.all([eatEaseApi.getMenu(), eatEaseApi.getTables()]);
    setCategories(menu.categories);
    setItems(menu.items);
    setTables(tableRows);
    setItemDraft((current) => ({ ...current, categoryId: current.categoryId || menu.categories[0]?.id || "" }));
  }

  useEffect(() => {
    load();
    return eatEaseApi.subscribe(load);
  }, []);

  async function saveCategory(event: FormEvent) {
    event.preventDefault();
    await eatEaseApi.saveCategory({ ...categoryDraft, id: categoryDraft.id || crypto.randomUUID() });
    setCategoryDraft(emptyCategory());
    load();
  }

  async function saveItem(event: FormEvent) {
    event.preventDefault();
    await eatEaseApi.saveMenuItem(itemDraft);
    setItemDraft(emptyItem(categories[0]?.id));
    load();
  }

  async function saveTable(event: FormEvent) {
    event.preventDefault();
    await eatEaseApi.saveTable({ ...tableDraft, id: tableDraft.id || crypto.randomUUID() });
    setTableDraft({ id: "", slug: "", number: "", isActive: true });
    load();
  }

  return (
    <main className="page-grid admin-layout">
      <section className="page-title">
        <div>
          <span className="eyebrow">{t(locale, "admin")}</span>
          <h1>
            <Utensils size={34} />
            {t(locale, "menu")}
          </h1>
        </div>
      </section>

      <section className="admin-grid">
        <form className="admin-form" onSubmit={saveCategory}>
          <h2>{t(locale, "newCategory")}</h2>
          <label className="field">
            <span>Thai</span>
            <input value={categoryDraft.name.th} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: { ...categoryDraft.name, th: event.target.value } })} required />
          </label>
          <label className="field">
            <span>English</span>
            <input value={categoryDraft.name.en} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: { ...categoryDraft.name, en: event.target.value } })} required />
          </label>
          <button className="primary" type="submit">
            <Plus size={16} />
            {t(locale, "save")}
          </button>
        </form>

        <form className="admin-form wide-form" onSubmit={saveItem}>
          <h2>{t(locale, "newItem")}</h2>
          <div className="two-col">
            <label className="field">
              <span>Thai</span>
              <input value={itemDraft.name.th} onChange={(event) => setItemDraft({ ...itemDraft, name: { ...itemDraft.name, th: event.target.value } })} required />
            </label>
            <label className="field">
              <span>English</span>
              <input value={itemDraft.name.en} onChange={(event) => setItemDraft({ ...itemDraft, name: { ...itemDraft.name, en: event.target.value } })} required />
            </label>
            <label className="field">
              <span>{t(locale, "price")}</span>
              <input min="0" type="number" value={itemDraft.price} onChange={(event) => setItemDraft({ ...itemDraft, price: Number(event.target.value) })} required />
            </label>
            <label className="field">
              <span>Category</span>
              <select value={itemDraft.categoryId} onChange={(event) => setItemDraft({ ...itemDraft, categoryId: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{localize(category.name, locale)}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Description TH</span>
            <textarea value={itemDraft.description.th} onChange={(event) => setItemDraft({ ...itemDraft, description: { ...itemDraft.description, th: event.target.value } })} />
          </label>
          <label className="field">
            <span>Description EN</span>
            <textarea value={itemDraft.description.en} onChange={(event) => setItemDraft({ ...itemDraft, description: { ...itemDraft.description, en: event.target.value } })} />
          </label>
          <label className="field">
            <span>
              <ImagePlus size={16} />
              {t(locale, "imageUrl")}
            </span>
            <input value={itemDraft.imageUrl} onChange={(event) => setItemDraft({ ...itemDraft, imageUrl: event.target.value, thumbnailUrl: event.target.value })} />
          </label>
          <div className="switch-row">
            <label><input checked={itemDraft.isAvailable} onChange={(event) => setItemDraft({ ...itemDraft, isAvailable: event.target.checked })} type="checkbox" /> {t(locale, "available")}</label>
            <label><input checked={itemDraft.isRecommended} onChange={(event) => setItemDraft({ ...itemDraft, isRecommended: event.target.checked })} type="checkbox" /> {t(locale, "recommended")}</label>
          </div>
          <button className="primary" type="submit">
            <Save size={16} />
            {t(locale, "save")}
          </button>
        </form>

        <form className="admin-form" onSubmit={saveTable}>
          <h2>{t(locale, "tables")}</h2>
          <label className="field">
            <span>Number</span>
            <input value={tableDraft.number} onChange={(event) => setTableDraft({ ...tableDraft, number: event.target.value })} required />
          </label>
          <label className="field">
            <span>QR slug</span>
            <input value={tableDraft.slug} onChange={(event) => setTableDraft({ ...tableDraft, slug: event.target.value })} required />
          </label>
          <button className="primary" type="submit">
            <Plus size={16} />
            {t(locale, "save")}
          </button>
        </form>
      </section>

      <section className="data-list">
        {items.map((item) => (
          <article key={item.id}>
            <img alt={localize(item.name, locale)} src={item.thumbnailUrl || item.imageUrl} />
            <div>
              <strong>{localize(item.name, locale)}</strong>
              <span>{money(item.price, locale)} · {item.isAvailable ? t(locale, "available") : t(locale, "unavailable")}</span>
            </div>
          </article>
        ))}
      </section>
      <section className="data-list compact">
        {tables.map((table) => (
          <article key={table.id}>
            <div>
              <strong>Table {table.number}</strong>
              <span>/table/{table.slug}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
