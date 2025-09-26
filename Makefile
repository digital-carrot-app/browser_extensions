build:
	mkdir build/

chrome: build
	rm -rf build/chrome/
	mkdir build/chrome/
	cp -R chrome/* build/chrome
	cp -R common/* build/chrome

firefox: build
	rm -rf build/firefox/
	mkdir build/firefox/
	cp -R firefox/* build/firefox
	cp -R common/* build/firefox
