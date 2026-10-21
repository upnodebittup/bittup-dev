-- Existing products keep their categories and shipping behavior.
INSERT INTO "Category" ("id", "name", "slug")
VALUES ('upnode-product-digital', 'Produto digital (sem frete)', 'produto-digital')
ON CONFLICT ("slug") DO NOTHING;
