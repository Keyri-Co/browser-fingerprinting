/**
 * Parses a CSS selector into tag name with HTML attributes.
 * Only single element selector are supported (without operators like space, +, >, etc).
 *
 * Multiple values can be returned for each attribute. You decide how to handle them.
 */
export function parseSimpleCssSelector(selector: string): [tag: string | undefined, attributes: Record<string, string[]>] {
  const errorMessage = `Unexpected syntax '${selector}'`;
  const tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector) as RegExpExecArray;
  const tag = tagMatch[1] || undefined;
  const attributes: Record<string, string[]> = {};
  const partsRegex = /([.:#][\w-]+|\[.+?\])/gi;

  const addAttribute = (name: string, value: string) => {
    attributes[name] = attributes[name] || [];
    attributes[name].push(value);
  };

  for (;;) {
    const match = partsRegex.exec(tagMatch[2]);
    if (!match) {
      break;
    }
    const part = match[0];
    switch (part[0]) {
      case '.':
        addAttribute('class', part.slice(1));
        break;
      case '#':
        addAttribute('id', part.slice(1));
        break;
      case '[': {
        const attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
        if (attributeMatch) {
          addAttribute(attributeMatch[1], attributeMatch[4] ?? attributeMatch[5] ?? '');
        } else {
          throw new Error(errorMessage);
        }
        break;
      }
      default:
        throw new Error(errorMessage);
    }
  }

  return [tag, attributes];
}

export function areSetsEqual(set1: Set<unknown>, set2: Set<unknown>): boolean {
  if (set1 === set2) {
    return true;
  }
  if (set1.size !== set2.size) {
    return false;
  }

  if (set1.values) {
    for (let iter = set1.values(), step = iter.next(); !step.done; step = iter.next()) {
      if (!set2.has(step.value)) {
        return false;
      }
    }
    return true;
  } else {
    // An implementation for browsers that don't support Set iterators
    let areEqual = true;
    set1.forEach((value) => {
      if (areEqual && !set2.has(value)) {
        areEqual = false;
      }
    });
    return areEqual;
  }
}
