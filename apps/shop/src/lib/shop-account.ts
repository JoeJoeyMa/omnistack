import type {
  ShopAccount,
  ShopAccountAddressDeleteInput,
  ShopAccountAddressInput,
  ShopAccountAddress,
  ShopAccountProfile,
  ShopAccountProfileInput,
} from "@maple-global/api-client";
import { getShopApiClient } from "./shop-api";

export function loadShopAccount() {
  return getShopApiClient().shopAccountGet() as Promise<ShopAccount>;
}

export function updateShopAccountProfile(input: ShopAccountProfileInput) {
  return getShopApiClient().shopAccountUpdateProfile(input) as Promise<ShopAccountProfile>;
}

export function upsertShopAccountAddress(input: ShopAccountAddressInput) {
  return getShopApiClient().shopAccountUpsertAddress(input) as Promise<ShopAccountAddress>;
}

export function deleteShopAccountAddress(input: ShopAccountAddressDeleteInput) {
  return getShopApiClient().shopAccountDeleteAddress(input) as Promise<{
    success: true;
  }>;
}
