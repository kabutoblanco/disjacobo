#!/bin/bash

FILES="$@"

for file in $FILES; do
    cwebp -m 6 -q 70 -mt -af -progress "$file" -o "$file.webp"
done

rename s/png\.// *.png.webp
rename s/jpg\.// *.jpg.webp
