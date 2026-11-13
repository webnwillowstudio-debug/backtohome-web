import re, pathlib
SRC = pathlib.Path(__file__).parent
OUT = pathlib.Path(__file__).parent.parent

I = {
 "target":'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 "compass":'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
 "users":'<path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"/><circle cx="10" cy="8" r="3.5"/><path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3M15 4.7a3.5 3.5 0 0 1 0 6.6"/>',
 "rocket":'<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.8-.8.8-2.2 0-3s-2.2-.8-3 0z"/><path d="M12 15 9 12a17 17 0 0 1 9-9c2 0 3 1 3 3a17 17 0 0 1-9 9z"/><path d="M9 12H5l2-4h4M12 15v4l4-2v-4"/>',
 "home":'<path d="M3 11 12 3l9 8"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
 "globe":'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3.5-3 14.5 0 18M12 3c3 3.5 3 14.5 0 18"/>',
 "shield":'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
 "layers":'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
 "heart":'<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z"/>',
 "brief":'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
 "bulb":'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
 "chart":'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 "coins":'<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 15v2c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.7-2.7-3-6-3"/>',
 "grad":'<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
 "mail":'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 "phone":'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 "clock":'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "arrow":'<path d="M5 12h14M13 6l6 6-6 6"/>',
 "up":'<path d="M12 19V5M6 11l6-6 6 6"/>',
 "check":'<path d="M5 12l5 5L20 7"/>',
 "fb":'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z"/>',
 "ig":'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
 "in":'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
 "yt":'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
 "wa":'<path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1 2 1c-.3 1.2-1.5 2-2.5 2A6 6 0 0 1 8 10c0-1 .8-2.2 2-2.5l1 2z"/>',
}
def icon(m):
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{I[m.group(1)]}</svg>'

head = (SRC/"partials/head.html").read_text()
header = (SRC/"partials/header.html").read_text()
footer = (SRC/"partials/footer.html").read_text()

for page in sorted((SRC/"pages").glob("*.html")):
    raw = page.read_text()
    meta = dict(re.findall(r"^<!--\s*(\w+):\s*(.*?)\s*-->", raw, re.M))
    body = re.sub(r"^<!--\s*\w+:.*?-->\n", "", raw, flags=re.M)
    hdr = header
    act = meta.get("nav", "")
    if act:
        hdr = hdr.replace(f'data-nav="{act}"', f'data-nav="{act}" class="active" aria-current="page"')
    hdr = hdr.replace("{{HEADER_CLASS}}", meta.get("header", ""))
    html = (head.replace("{{TITLE}}", meta["title"]).replace("{{DESC}}", meta["desc"])
            + hdr + body + footer)
    html = re.sub(r"\{\{i:(\w+)\}\}", icon, html)
    (OUT/page.name).write_text(html)
    print("built", page.name, len(html))
