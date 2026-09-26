#!/usr/bin/env python3
import json, os, urllib.parse, urllib.request
from datetime import datetime, timezone

API_BASE="https://api.x.com/2"
username=os.environ.get("X_USERNAME","").strip().lstrip("@")
token=os.environ.get("X_BEARER_TOKEN","").strip()
if not username or not token:
    raise SystemExit("Missing X_USERNAME or X_BEARER_TOKEN")

def get(path, params=None):
    url=API_BASE+path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req=urllib.request.Request(url, headers={"Authorization":"Bearer "+token,"User-Agent":"github-pages-x-feed"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

user=get("/users/by/username/"+urllib.parse.quote(username))
uid=user["data"]["id"]

data=get("/users/"+uid+"/tweets",{
    "max_results":100,
    "exclude":"replies",
    "tweet.fields":"created_at,referenced_tweets",
    "expansions":"referenced_tweets.id,referenced_tweets.id.author_id",
    "user.fields":"username"
})

inc_tweets={x["id"]:x for x in data.get("includes",{}).get("tweets",[])}
inc_users={x["id"]:x for x in data.get("includes",{}).get("users",[])}

months=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"]
def date_it(s):
    d=datetime.fromisoformat(s.replace("Z","+00:00"))
    return f"{d.day} {months[d.month-1]} {d.year}"

posts=[]
for t in data.get("data",[]):
    refs=t.get("referenced_tweets") or []
    kinds={r.get("type") for r in refs}
    if "quoted" in kinds or "replied_to" in kinds:
        continue
    if "retweeted" in kinds:
        ref=next(r for r in refs if r.get("type")=="retweeted")
        src=inc_tweets.get(ref["id"],{})
        author=inc_users.get(src.get("author_id"),{})
        author_name=author.get("username","")
        url=f"https://x.com/{author_name}/status/{src.get('id','')}" if author_name else f"https://x.com/{username}"
        posts.append({"id":t["id"],"date":date_it(t["created_at"]),"category":"Repost","title":f"Repost da @{author_name}" if author_name else "Repost su X","text":src.get("text",t.get("text","")),"url":url})
    else:
        posts.append({"id":t["id"],"date":date_it(t["created_at"]),"category":"X","title":"Post su X","text":t.get("text",""),"url":f"https://x.com/{username}/status/{t['id']}"})
    if len(posts)>=30:
        break

with open("posts.json","w",encoding="utf-8") as f:
    json.dump({"source":"x","updated_at":datetime.now(timezone.utc).isoformat(),"posts":posts},f,ensure_ascii=False,indent=2)
    f.write("\n")
