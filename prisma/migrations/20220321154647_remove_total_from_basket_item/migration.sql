/*
  Warnings:

  - You are about to drop the column `total` on the `BasketItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BasketItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "BasketItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BasketItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BasketItem" ("id", "itemId", "quantity", "userId") SELECT "id", "itemId", "quantity", "userId" FROM "BasketItem";
DROP TABLE "BasketItem";
ALTER TABLE "new_BasketItem" RENAME TO "BasketItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
