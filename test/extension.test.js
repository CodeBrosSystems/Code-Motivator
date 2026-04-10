const assert = require("assert");

const { __testing } = require("../extension");

function createDocument(id, lineCount) {
  return {
    uri: {
      toString() {
        return id;
      },
    },
    lineCount,
  };
}

suite("Extension Test Suite", () => {
  test("returns a deterministic motivational message", () => {
    const message = __testing.getRandomMessage(() => 0);

    assert.strictEqual(message, __testing.MESSAGES[0]);
  });

  test("renders motivational messages in the temporary status bar", () => {
    const statusBarItem = {
      text: "",
      tooltip: "",
      visible: false,
      show() {
        this.visible = true;
      },
      hide() {
        this.visible = false;
      },
    };

    const presentMessage = __testing.createTemporaryStatusMessagePresenter(
      statusBarItem,
      1000,
    );

    presentMessage("Mensaje bonito");

    assert.strictEqual(statusBarItem.text, "$(sparkle) Mensaje bonito");
    assert.strictEqual(statusBarItem.tooltip, "Code Motivator");
    assert.strictEqual(statusBarItem.visible, true);
  });

  test("tracks only added lines across document changes", () => {
    const document = createDocument("file://demo.txt", 2);
    const tracker = __testing.createSessionTracker([document]);

    document.lineCount = 4;
    const firstUpdate = tracker.trackDocumentChange(document);

    assert.deepStrictEqual(firstUpdate, {
      totalAddedLines: 2,
      reachedCelebrationTarget: false,
    });

    document.lineCount = 1;
    const secondUpdate = tracker.trackDocumentChange(document);

    assert.deepStrictEqual(secondUpdate, {
      totalAddedLines: 2,
      reachedCelebrationTarget: false,
    });
  });

  test("celebrates when the session reaches the configured step", () => {
    const document = createDocument("file://milestone.txt", 1);
    const tracker = __testing.createSessionTracker([document]);

    document.lineCount = __testing.CELEBRATION_STEP + 1;
    const update = tracker.trackDocumentChange(document);

    assert.deepStrictEqual(update, {
      totalAddedLines: __testing.CELEBRATION_STEP,
      reachedCelebrationTarget: true,
    });
  });

  test("uses the configured interval when it is valid", () => {
    const workspace = {
      getConfiguration() {
        return {
          get() {
            return 15000;
          },
        };
      },
    };

    assert.strictEqual(__testing.getConfiguredInterval(workspace), 15000);
  });

  test("falls back to the default interval when the value is invalid", () => {
    const workspace = {
      getConfiguration() {
        return {
          get() {
            return 0;
          },
        };
      },
    };

    assert.strictEqual(
      __testing.getConfiguredInterval(workspace),
      __testing.DEFAULT_MESSAGE_INTERVAL,
    );
  });

  test("updates the status bar text with added lines", () => {
    const statusBarItem = { text: "" };

    __testing.updateStatusBar(statusBarItem, 12);

    assert.strictEqual(statusBarItem.text, "$(rocket) 12 líneas añadidas");
  });
});
