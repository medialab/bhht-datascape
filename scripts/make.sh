# Cleanup
npm run clean

# Bulding javascript
npm run build

# Copying data & images
cp -r ./data build/data
cp -r ./public build/public

# Templating index
sed s@/build/bundle.js@$BASE_URL/bundle.js@ index.html > build/index.html

# Config files
touch ./build/.nojekyll
